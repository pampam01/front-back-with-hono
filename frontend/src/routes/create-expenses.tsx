import { createFileRoute } from '@tanstack/react-router'

const CreateExpenses = () => {
  return (
    <div>
      <div className='font-white'>
        Create Expenses
      </div>
    </div>
  )
}


export const Route = createFileRoute('/create-expenses')({
  component: () => <CreateExpenses />,
})