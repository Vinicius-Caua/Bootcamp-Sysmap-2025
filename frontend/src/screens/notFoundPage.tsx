import { useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-10">
      <h1 className="text-9xl">404 Not Found</h1>
      <p className="text-4xl">Verifique o endereço da página.</p>
      <span
        className="text-3xl cursor-pointer underline"
        onClick={() => navigate("/login")}
      >
        Retornar ao Login
      </span>
    </div>
  );
}

export default NotFoundPage;
