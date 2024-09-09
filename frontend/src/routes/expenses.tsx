import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";


import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query';



const getAllExpenses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("Server Error")
  }
  const data = await response.json();
  return data
}

const Expenses = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  if (error) return <div>Error: {error.message}</div>
  return (
    <div className='p-2 max-w-3xl m-auto'>

      <Table>
        <TableCaption>A list of your Expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead >Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? Array(3).fill(0).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell >
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          )) : data?.expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>

            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {/* <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow> */}
        </TableFooter>
      </Table>


    </div>
  )
}


export const Route = createFileRoute('/expenses')({
  component: () => <Expenses />,
})