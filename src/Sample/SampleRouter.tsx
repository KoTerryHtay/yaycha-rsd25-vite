import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>template</div>,
    children: [
      {
        path: "/",
        element: <div>home</div>,
      },
    ],
  },
  {
    path: "/:id",
    element: <div>home</div>,
  },
]);

export default function SampleRouter() {
  const { id } = useParams();

  console.log(id);

  return <RouterProvider router={router} />;
}
