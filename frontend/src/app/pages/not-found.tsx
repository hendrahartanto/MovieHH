import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">404 - Not Found</h1>
      <p className="">Sorry, the page does not exist.</p>
      {/* TODO: update path to home page */}
      <Link className="text-sm text-blue-600 hover:underline" to={"/"}>
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
