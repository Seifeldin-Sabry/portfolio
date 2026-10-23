"use client"

import {useCallback, useEffect, useRef, useState} from "react"

type GameId = "minesweeper" | "snake" | "tictactoe"

const GAMES: {id: GameId; label: string}[] = [
    {id: "snake", label: "🍎 Apple Snake"},
    {id: "minesweeper", label: "💣 Minesweeper"},
    {id: "tictactoe", label: "⭕ Tic-tac-toe"},
]

export default function GamesApp() {
    const [game, setGame] = useState<GameId>("snake")
    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 justify-center gap-1 border-b border-window-border p-2">
                {GAMES.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => setGame(g.id)}
                        className={`rounded-md px-3 py-1 text-xs font-medium ${
                            game === g.id ? "bg-foreground/15 text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {g.label}
                    </button>
                ))}
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto p-4">
                {game === "snake" && <AppleSnake/>}
                {game === "minesweeper" && <Minesweeper/>}
                {game === "tictactoe" && <TicTacToe/>}
            </div>
        </div>
    )
}

function useBest(key: string): [number, (score: number) => void] {
    const [best, setBest] = useState(0)
    useEffect(() => {
        try {
            setBest(Number(localStorage.getItem(key) ?? 0))
        } catch {
            /* private mode */
        }
    }, [key])
    const submit = useCallback(
        (score: number) => {
            setBest((b) => {
                if (score <= b) return b
                try {
                    localStorage.setItem(key, String(score))
                } catch {
                    /* private mode */
                }
                return score
            })
        },
        [key],
    )
    return [best, submit]
}

// ── Apple Snake ──────────────────────────────────────────────────────────────

const SNAKE_SIZE = 16
const SNAKE_TICK_MS = 170
/** Board geometry: 336px box with 4px padding (p-1) around the 328px grid. */
const SNAKE_PAD = 4
const SNAKE_CELL = (336 - SNAKE_PAD * 2) / SNAKE_SIZE
type Point = {x: number; y: number}
const DIRS: Record<string, Point> = {
    ArrowUp: {x: 0, y: -1}, w: {x: 0, y: -1},
    ArrowDown: {x: 0, y: 1}, s: {x: 0, y: 1},
    ArrowLeft: {x: -1, y: 0}, a: {x: -1, y: 0},
    ArrowRight: {x: 1, y: 0}, d: {x: 1, y: 0},
}

function randomApple(snake: Point[]): Point {
    // ponytail: rejection sampling, fine until the snake fills most of a 16×16 board.
    for (;;) {
        const p = {x: Math.floor(Math.random() * SNAKE_SIZE), y: Math.floor(Math.random() * SNAKE_SIZE)}
        if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p
    }
}

function AppleSnake() {
    const initial = [{x: 8, y: 8}, {x: 7, y: 8}, {x: 6, y: 8}]
    const [snake, setSnake] = useState<Point[]>(initial)
    const [apple, setApple] = useState<Point>({x: 12, y: 8})
    const [status, setStatus] = useState<"ready" | "playing" | "over">("ready")
    const [best, submitBest] = useBest("seif-os-snake-best")
    const dir = useRef<Point>({x: 1, y: 0})
    const queued = useRef<Point>({x: 1, y: 0})
    const boardRef = useRef<HTMLDivElement>(null)
    const score = snake.length - initial.length

    const start = () => {
        setSnake(initial)
        setApple(randomApple(initial))
        dir.current = queued.current = {x: 1, y: 0}
        setStatus("playing")
        boardRef.current?.focus()
    }

    useEffect(() => {
        if (status !== "playing") return
        const id = setInterval(() => {
            setSnake((prev) => {
                // Ignore 180° turns: they would run the head into the neck.
                const q = queued.current
                if (q.x !== -dir.current.x || q.y !== -dir.current.y) dir.current = q
                // No walls: leaving one edge wraps to the opposite side.
                const wrap = (n: number) => (n + SNAKE_SIZE) % SNAKE_SIZE
                const head = {x: wrap(prev[0].x + dir.current.x), y: wrap(prev[0].y + dir.current.y)}
                if (prev.some((s) => s.x === head.x && s.y === head.y)) {
                    setStatus("over")
                    submitBest(prev.length - initial.length)
                    return prev
                }
                const ate = head.x === apple.x && head.y === apple.y
                const next = [head, ...(ate ? prev : prev.slice(0, -1))]
                if (ate) setApple(randomApple(next))
                return next
            })
        }, SNAKE_TICK_MS)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, apple])

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex w-full justify-between font-mono text-xs text-muted-foreground">
                <span>🍎 {score}</span>
                <span>best {best}</span>
            </div>
            <div
                ref={boardRef}
                tabIndex={0}
                onKeyDown={(e) => {
                    const d = DIRS[e.key]
                    if (d) (e.preventDefault(), (queued.current = d))
                    if (e.key === " " && status !== "playing") (e.preventDefault(), start())
                }}
                className="relative overflow-hidden rounded-lg bg-foreground/5 p-1 outline-none ring-accent/50 focus:ring-2"
                style={{width: 336, height: 336}}
                aria-label="Apple Snake board. Use arrow keys."
            >
                {/* Checkerboard is pure CSS: the tick re-renders only the ~15
                    snake segments instead of all 256 grid cells. */}
                <div
                    className="absolute inset-1 rounded-[4px]"
                    style={{
                        backgroundImage: "repeating-conic-gradient(hsl(var(--foreground) / 0.03) 0% 25%, transparent 0% 50%)",
                        backgroundSize: `${SNAKE_CELL * 2}px ${SNAKE_CELL * 2}px`,
                    }}
                />
                {snake.map((s, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-[4px] ${i === 0 ? "bg-accent" : "bg-accent/60"}`}
                        style={{left: SNAKE_PAD + s.x * SNAKE_CELL, top: SNAKE_PAD + s.y * SNAKE_CELL, width: SNAKE_CELL, height: SNAKE_CELL}}
                    />
                ))}
                <div
                    className="absolute flex items-center justify-center text-[11px] leading-none"
                    style={{left: SNAKE_PAD + apple.x * SNAKE_CELL, top: SNAKE_PAD + apple.y * SNAKE_CELL, width: SNAKE_CELL, height: SNAKE_CELL}}
                >
                    🍎
                </div>
                {status !== "playing" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/70 backdrop-blur-sm">
                        <p className="text-sm font-semibold">{status === "over" ? `Game over · ${score} apples` : "Apple Snake"}</p>
                        <button onClick={start} className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
                            {status === "over" ? "Play again" : "Start"}
                        </button>
                        <p className="font-mono text-[10px] text-muted-foreground">arrows / WASD · space to start</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Minesweeper ──────────────────────────────────────────────────────────────

const MS_SIZE = 9
const MS_MINES = 10
interface Cell {
    mine: boolean
    open: boolean
    flag: boolean
    near: number
}
const NUMBER_COLORS = ["", "text-sky-400", "text-teal-300", "text-rose-400", "text-indigo-300", "text-amber-400", "text-cyan-300", "text-foreground", "text-muted-foreground"]

function neighbours(i: number): number[] {
    const x = i % MS_SIZE
    const y = Math.floor(i / MS_SIZE)
    const out: number[] = []
    for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx
            const ny = y + dy
            if ((dx || dy) && nx >= 0 && ny >= 0 && nx < MS_SIZE && ny < MS_SIZE) out.push(ny * MS_SIZE + nx)
        }
    return out
}

const emptyBoard = (): Cell[] => Array.from({length: MS_SIZE * MS_SIZE}, () => ({mine: false, open: false, flag: false, near: 0}))

/** Mines are placed on the first click, never on or around it. */
function seed(board: Cell[], safe: number): Cell[] {
    const forbidden = new Set([safe, ...neighbours(safe)])
    const next = board.map((c) => ({...c}))
    let placed = 0
    while (placed < MS_MINES) {
        const i = Math.floor(Math.random() * next.length)
        if (forbidden.has(i) || next[i].mine) continue
        next[i].mine = true
        placed++
    }
    next.forEach((c, i) => (c.near = neighbours(i).filter((n) => next[n].mine).length))
    return next
}

function flood(board: Cell[], start: number): Cell[] {
    const next = board.map((c) => ({...c}))
    const stack = [start]
    while (stack.length) {
        const i = stack.pop()!
        if (next[i].open || next[i].flag) continue
        next[i].open = true
        if (next[i].near === 0 && !next[i].mine) stack.push(...neighbours(i))
    }
    return next
}

function Minesweeper() {
    const [board, setBoard] = useState<Cell[]>(emptyBoard)
    const [seeded, setSeeded] = useState(false)
    const [status, setStatus] = useState<"playing" | "won" | "lost">("playing")
    const [startedAt, setStartedAt] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (!startedAt || status !== "playing") return
        const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 250)
        return () => clearInterval(id)
    }, [startedAt, status])

    const reset = () => {
        setBoard(emptyBoard())
        setSeeded(false)
        setStatus("playing")
        setStartedAt(null)
        setElapsed(0)
    }

    const reveal = (i: number) => {
        if (status !== "playing" || board[i].flag || board[i].open) return
        let current = board
        if (!seeded) {
            current = seed(board, i)
            setSeeded(true)
            setStartedAt(Date.now())
        }
        if (current[i].mine) {
            setBoard(current.map((c) => (c.mine ? {...c, open: true} : c)))
            setStatus("lost")
            return
        }
        const next = flood(current, i)
        setBoard(next)
        if (next.every((c) => c.mine || c.open)) setStatus("won")
    }

    const toggleFlag = (i: number) => {
        if (status !== "playing" || board[i].open) return
        setBoard(board.map((c, j) => (j === i ? {...c, flag: !c.flag} : c)))
    }

    const flags = board.filter((c) => c.flag).length

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
                <span>💣 {MS_MINES - flags}</span>
                <button onClick={reset} className="text-lg leading-none" aria-label="New game">
                    {status === "lost" ? "😵" : status === "won" ? "😎" : "🙂"}
                </button>
                <span>⏱ {elapsed}s</span>
            </div>
            <div className="grid gap-[3px] rounded-lg bg-foreground/5 p-1.5" style={{gridTemplateColumns: `repeat(${MS_SIZE}, 32px)`}}>
                {board.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => reveal(i)}
                        onContextMenu={(e) => (e.preventDefault(), toggleFlag(i))}
                        aria-label={c.open ? (c.mine ? "mine" : `${c.near} nearby`) : c.flag ? "flagged" : "hidden"}
                        className={`flex h-8 w-8 items-center justify-center rounded-[5px] text-sm font-bold ${
                            c.open
                                ? c.mine
                                    ? "bg-rose-500/40"
                                    : "bg-foreground/[0.04]"
                                : "bg-foreground/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-foreground/20"
                        } ${NUMBER_COLORS[c.near]}`}
                    >
                        {c.open ? (c.mine ? "💣" : c.near || "") : c.flag ? "🚩" : ""}
                    </button>
                ))}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">
                {status === "won" ? `cleared in ${elapsed}s!` : status === "lost" ? "boom. click the face to retry" : "click to reveal · right-click to flag"}
            </p>
        </div>
    )
}

// ── Tic-tac-toe (unbeatable minimax) ────────────────────────────────────────

type Mark = "X" | "O" | null
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function winner(b: Mark[]): Mark | "draw" | null {
    for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
    return b.every(Boolean) ? "draw" : null
}

/** Score from O's perspective; depth makes it prefer quick wins and slow losses. */
function minimax(b: Mark[], turn: "X" | "O", depth: number): number {
    const w = winner(b)
    if (w === "O") return 10 - depth
    if (w === "X") return depth - 10
    if (w === "draw") return 0
    const scores = b.flatMap((m, i) => (m ? [] : [minimax(b.map((x, j) => (j === i ? turn : x)), turn === "O" ? "X" : "O", depth + 1)]))
    return turn === "O" ? Math.max(...scores) : Math.min(...scores)
}

function bestMove(b: Mark[]): number {
    let best = -1
    let bestScore = -Infinity
    b.forEach((m, i) => {
        if (m) return
        const score = minimax(b.map((x, j) => (j === i ? "O" : x)), "X", 1)
        if (score > bestScore) (bestScore = score), (best = i)
    })
    return best
}

function TicTacToe() {
    const [board, setBoard] = useState<Mark[]>(Array(9).fill(null))
    const [tally, setTally] = useState({you: 0, seif: 0, draw: 0})
    const result = winner(board)

    const play = (i: number) => {
        if (board[i] || result) return
        let next = board.map((m, j) => (j === i ? "X" : m)) as Mark[]
        if (!winner(next)) {
            const reply = bestMove(next)
            next = next.map((m, j) => (j === reply ? "O" : m)) as Mark[]
        }
        setBoard(next)
        const w = winner(next)
        if (w) setTally((t) => ({...t, [w === "X" ? "you" : w === "O" ? "seif" : "draw"]: t[w === "X" ? "you" : w === "O" ? "seif" : "draw"] + 1}))
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground">
                you {tally.you} · seif-bot {tally.seif} · draws {tally.draw}
            </p>
            <div className="grid grid-cols-3 gap-2">
                {board.map((m, i) => (
                    <button
                        key={i}
                        onClick={() => play(i)}
                        aria-label={m ?? `empty cell ${i + 1}`}
                        className={`flex h-20 w-20 items-center justify-center rounded-xl bg-foreground/[0.07] text-4xl font-light hover:bg-foreground/10 ${
                            m === "X" ? "text-foreground" : "text-accent"
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
            <p className="h-4 text-xs text-muted-foreground">
                {result === "X" ? "you won?! that shouldn't be possible" : result === "O" ? "seif-bot wins. it never loses." : result === "draw" ? "draw — the best you can do" : "you're X. good luck."}
            </p>
            {result && (
                <button onClick={() => setBoard(Array(9).fill(null))} className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
                    Play again
                </button>
            )}
        </div>
    )
}
