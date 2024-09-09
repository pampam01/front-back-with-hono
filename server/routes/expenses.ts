import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";


const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})


type Expenses = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })


const fakeExpenses: Expenses[] = [
    {
        id: 1,
        title: "Expense 1",
        amount: 40
    },
    {
        id: 2,
        title: "Expense 2",
        amount: 20
    },
    {
        id: 3,
        title: "Expense 3",
        amount: 30
    }
];



export const expenseRoute = new Hono()
    .get("/", (c) => {
        return c.json({ expenses: fakeExpenses })
    })

    .post("/", zValidator("json", createPostSchema), (c) => {
        const data =  c.req.valid("json")
        const expense = createPostSchema.parse(data);
        fakeExpenses.push({

            id: fakeExpenses.length + 1,
            ...expense
        })
        return c.json(expense)
    })
    .get("/total-spent", c => {
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        return c.json({ total })
    })
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const expense = fakeExpenses.find(expense => expense.id === id);

        if (!expense) {
            return c.notFound();
        }
        return c.json({ expense })
    })

    .delete("/:id{[0-9]+}", c => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex(expense => expense.id === id);
        if (index === -1) {
            return c.notFound();
        }

        const deleteExpenses = fakeExpenses.splice(index, 1)[0];

        return c.json({ expense: deleteExpenses })
    })

