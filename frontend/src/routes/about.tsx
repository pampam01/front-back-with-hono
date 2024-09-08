import { createFileRoute } from "@tanstack/react-router";


const About = () => {
  return (
    <div className="p-2">
      <div>
        Hello World
      </div>
    </div>
  )
}

export const Route = createFileRoute("/about")({
  component: () => <About />,
})


