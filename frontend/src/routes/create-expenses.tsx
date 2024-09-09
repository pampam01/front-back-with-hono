import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useForm } from "@tanstack/react-form"
import type { FieldApi } from "@tanstack/react-form"
import { api } from '@/lib/api'




function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

const CreateExpenses = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0
    },

    onSubmit: async ({ value }) => {

      const response = await api.expenses.$post({ json: value });

      if (!response.ok) throw new Error('Server Error')
      console.log(value)

      navigate({ to: '/expenses' });
    }
  })

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold text-center'>
        Create Expenses
      </h2>

      <form className='max-w-2xl mx-auto mt-4'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >

        <form.Field
          name='title'
          children={(field) => (
            <div className='my-4'>
              <Label htmlFor={field.name} className=''>Title</Label>
              <Input
                type='text'
                id={field.name}
                placeholder='Title'
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              <FieldInfo field={field} />
            </div>
          )}
        />


        <form.Field
          name='amount'
          children={(field) => (
            <div className='my-4'>
              <Label htmlFor={field.name} className=''>Amount</Label>
              <Input
                type='number'
                id={field.name}
                placeholder='Amount'
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />

              <FieldInfo field={field} />
            </div>
          )}
        />


        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} >
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}


export const Route = createFileRoute('/create-expenses')({
  component: () => <CreateExpenses />,
})