import Link from "next/link";

function Footer() {
  return (
    <div>
      <footer className="bg-blue-500 text-white py-4 mt-8 dark:bg-gray-800 dark:text-gray-200">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
          <p>
            <Link href="/" className=" hover:underline">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/" className=" hover:underline ml-2">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
