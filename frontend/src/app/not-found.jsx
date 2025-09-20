import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-900 transition-colors"
          >
            Go Back Home
          </Link>

          <div className="text-sm text-gray-500">
            <Link href="/login" className="bg-purple-700 hover:underline">
              Login
            </Link>
            {" | "}
            <Link href="/about" className="bg-purple-700 hover:underline">
              About Us
            </Link>
            {" | "}
            <Link href="/contact" className="bg-purple-700 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
