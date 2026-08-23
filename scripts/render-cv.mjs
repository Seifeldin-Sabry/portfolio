import fs from "node:fs"
import path from "node:path"
import PDFDocument from "pdfkit"
import {marked} from "marked"

const root = process.cwd()
const sourcePath = path.join(root, "cv", "seifeldin-swe-cv.md")
const outputPath = path.join(root, "public", "assets", "documents", "seifeldin-swe-cv.pdf")
const markdown = fs.readFileSync(sourcePath, "utf8")
const tokens = marked.lexer(markdown)

const document = {
    name: "",
    role: "",
    contact: "",
    sections: [],
}

let currentSection = null
let currentRole = null

for (const token of tokens) {
    if (token.type === "heading") {
        if (token.depth === 1) {
            document.name = token.text
        } else if (token.depth === 2) {
            currentSection = {title: token.text, roles: [], bullets: [], paragraphs: [], table: null}
            document.sections.push(currentSection)
            currentRole = null
        } else if (token.depth === 3) {
            currentRole = {title: token.text, dates: "", stack: "", bullets: []}
            currentSection?.roles.push(currentRole)
        }
        continue
    }

    if (token.type === "paragraph") {
        if (!document.role) {
            document.role = token.text
        } else if (!document.contact) {
            document.contact = token.text
        } else if (currentRole && /^Stack:/i.test(token.text)) {
            currentRole.stack = token.text.replace(/^Stack:\s*/i, "")
        } else if (currentRole && !currentRole.dates) {
            currentRole.dates = token.text
        } else if (currentSection && !currentRole) {
            currentSection.paragraphs.push(token.text)
        }
        continue
    }

    if (token.type === "list") {
        const items = token.items.map((item) => item.text)
        if (currentRole) {
            currentRole.bullets.push(...items)
        } else {
            currentSection?.bullets.push(...items)
        }
        continue
    }

    if (token.type === "table") {
        currentSection.table = {
            headings: token.header.map((cell) => cell.text),
            rows: token.rows.map((row) => row.map((cell) => cell.text)),
        }
    }
}

if (!document.name || !document.role || !document.contact || document.sections.length === 0) {
    throw new Error("CV markdown is missing the required identity or section headings")
}

fs.mkdirSync(path.dirname(outputPath), {recursive: true})

const PAGE_WIDTH = 595.276
const PAGE_HEIGHT = 841.89
const MARGIN_X = 52
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2
const BOTTOM = 42
const BLUE = "#1616f4"
const BLACK = "#111111"
const GREY = "#343434"

const pdf = new PDFDocument({size: "A4", margin: 0, autoFirstPage: true})
pdf.pipe(fs.createWriteStream(outputPath))

function ensureSpace(height) {
    if (pdf.y + height > PAGE_HEIGHT - BOTTOM) {
        pdf.addPage({size: "A4", margin: 0})
        pdf.y = 42
    }
}

function cleanInline(value) {
    return value
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/[`*_]/g, "")
}

function parseInlineLinks(value) {
    const segments = []
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    let lastIndex = 0
    let match

    while ((match = linkPattern.exec(value))) {
        if (match.index > lastIndex) {
            segments.push({text: value.slice(lastIndex, match.index), href: null})
        }
        segments.push({text: match[1], href: match[2]})
        lastIndex = match.index + match[0].length
    }

    if (lastIndex < value.length) {
        segments.push({text: value.slice(lastIndex), href: null})
    }

    return segments.length > 0 ? segments : [{text: value, href: null}]
}

function writeContact(value) {
    const segments = parseInlineLinks(value)
    pdf.font("Helvetica").fontSize(8.8).fillColor(BLACK)
    const totalWidth = segments.reduce((total, segment) => total + pdf.widthOfString(segment.text), 0)
    let x = MARGIN_X + (CONTENT_WIDTH - totalWidth) / 2

    for (const segment of segments) {
        const width = pdf.widthOfString(segment.text)
        pdf.text(segment.text, x, 91, {width, lineBreak: false, link: segment.href ?? undefined, underline: false})
        x += width
    }
}

function writeSectionHeading(title) {
    ensureSpace(24)
    const y = pdf.y
    const label = title.toUpperCase()
    pdf.font("Times-Roman").fontSize(16.5).fillColor(BLUE).text(label, MARGIN_X, y, {lineBreak: false})
    const lineStart = MARGIN_X + pdf.widthOfString(label) + 8
    pdf.moveTo(lineStart, y + 10).lineTo(PAGE_WIDTH - MARGIN_X, y + 10).lineWidth(0.45).strokeColor("#222222").stroke()
    pdf.y = y + 22
}

function writeBullets(items, {fontSize = 9.2, gap = 2.8} = {}) {
    for (const item of items) {
        const text = cleanInline(item)
        const bulletWidth = 10
        const textWidth = CONTENT_WIDTH - bulletWidth
        pdf.font("Times-Roman").fontSize(fontSize).fillColor(BLACK)
        const height = pdf.heightOfString(text, {width: textWidth, lineGap: 0.8})
        ensureSpace(height + gap)
        const y = pdf.y
        pdf.text("•", MARGIN_X, y, {lineBreak: false})
        pdf.text(text, MARGIN_X + bulletWidth, y, {width: textWidth, lineGap: 0.8})
        pdf.y += gap
    }
}

function writeParagraph(value) {
    const text = cleanInline(value)
    pdf.font("Times-Roman").fontSize(9.9).fillColor(GREY)
    const height = pdf.heightOfString(text, {width: CONTENT_WIDTH, lineGap: 1})
    ensureSpace(height + 6)
    pdf.text(text, MARGIN_X, pdf.y, {width: CONTENT_WIDTH, lineGap: 1})
    pdf.y += 6
}

function writeRole(role) {
    const [title, company = ""] = role.title.split("|").map((part) => part.trim())
    const y = pdf.y
    const leftWidth = CONTENT_WIDTH - 118
    pdf.font("Times-Bold").fontSize(11.2).fillColor(BLACK).text(title, MARGIN_X, y, {width: leftWidth, lineBreak: false})
    if (company) {
        const separatorX = MARGIN_X + pdf.widthOfString(title) + 7
        pdf.font("Times-Roman").text(`| ${company}`, separatorX, y, {lineBreak: false})
    }
    pdf.font("Times-Roman").fontSize(9.4).text(role.dates, MARGIN_X, y, {width: CONTENT_WIDTH, align: "right", lineBreak: false})
    pdf.y = y + Math.max(pdf.currentLineHeight(), 13) + 2

    if (role.stack) {
        pdf.font("Times-Roman").fontSize(9).fillColor(GREY).text(`Stack: ${cleanInline(role.stack)}`, MARGIN_X, pdf.y, {width: CONTENT_WIDTH, lineGap: 0.5})
        pdf.y += 2
    }

    writeBullets(role.bullets, {fontSize: 9.2, gap: 2.8})
}

function writeTable(table) {
    const tableX = MARGIN_X + 118
    const widths = [72, 128, 64]
    const tableWidth = widths.reduce((total, width) => total + width, 0)
    const rowHeight = 20
    ensureSpace(rowHeight * (table.rows.length + 1) + 8)
    const startY = pdf.y

    pdf.lineWidth(0.6).strokeColor("#222222")
    pdf.moveTo(tableX, startY).lineTo(tableX + tableWidth, startY).stroke()

    function row(values, y, bold = false) {
        let x = tableX
        values.forEach((value, index) => {
            pdf.font(bold ? "Times-Bold" : "Times-Roman").fontSize(9.2).fillColor(BLACK).text(cleanInline(value), x + 6, y + 4, {width: widths[index] - 12, align: "center", lineBreak: false})
            x += widths[index]
        })
    }

    row(table.headings, startY, true)
    pdf.moveTo(tableX, startY + rowHeight).lineTo(tableX + tableWidth, startY + rowHeight).stroke()
    table.rows.forEach((values, index) => row(values, startY + rowHeight * (index + 1)))
    pdf.moveTo(tableX, startY + rowHeight * (table.rows.length + 1)).lineTo(tableX + tableWidth, startY + rowHeight * (table.rows.length + 1)).stroke()
    pdf.y = startY + rowHeight * (table.rows.length + 1) + 6
}

pdf.font("Times-Roman").fillColor(BLACK).fontSize(30).text(document.name.toUpperCase(), MARGIN_X, 34, {width: CONTENT_WIDTH, align: "center", lineBreak: false})
pdf.font("Times-Roman").fontSize(14).text(document.role.toUpperCase(), MARGIN_X, 70, {width: CONTENT_WIDTH, align: "center", lineBreak: false})
writeContact(document.contact)
pdf.moveTo(MARGIN_X, 114).lineTo(PAGE_WIDTH - MARGIN_X, 114).lineWidth(0.45).strokeColor("#222222").stroke()
pdf.y = 128

for (const section of document.sections) {
    writeSectionHeading(section.title)
    if (section.paragraphs.length > 0) {
        section.paragraphs.forEach(writeParagraph)
    }
    if (section.roles.length > 0) {
        section.roles.forEach(writeRole)
    }
    if (section.bullets.length > 0) {
        writeBullets(section.bullets, {fontSize: 9.2, gap: 2.8})
    }
    if (section.table) {
        writeTable(section.table)
    }
    pdf.y += 6
}

pdf.end()
