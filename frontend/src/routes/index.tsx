import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  useQuery
} from "@tanstack/react-query"

import { api } from "@/lib/api"

import { createFileRoute } from "@tanstack/react-router";






const getTotalSpent = async () => {
  const response = await api.expenses["total-spent"].$get();

  if (!response.ok) { throw new Error("Failed to fetch total spent") }
  const data = response.json();
  return data;
}


const Index = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  })

  if (error) return <div>Error: {error.message}</div>



  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>
          The total amount of money you have spent on your purchases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? "..." : data.total}
      </CardContent>
    </Card>
  )
}

export const Route = createFileRoute("/")({
  component: () => <Index />,
})

