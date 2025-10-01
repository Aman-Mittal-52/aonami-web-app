import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function AccessDeniedPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 px-4 py-10">
			<div className="text-center">
				<p className="text-base font-semibold">403</p>
				<h1 className="mt-4 text-5xl font-normal tracking-tight text-balance text-gray-900 sm:text-7xl">
					Access Denied
				</h1>
				<p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
					Sorry, you don't have access to this page.
				</p>
				<p className="flex items-center justify-center gap-x-6">
					<Button className="mt-10">
						<Link to="/">Go to home</Link>
					</Button>
				</p>
			</div>
		</div>
	);
}
