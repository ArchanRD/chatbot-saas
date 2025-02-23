

export default async function Home() {
    
    return (
        <div className="flex gap-2 h-screen w-screen justify-center items-center">
            <a className="bg-blue-500 font-inter px-8 py-3 text-white rounded-md" href="/dashboard">Dashboard</a>
            <a className="bg-gray-800 font-inter px-8 py-3 text-white rounded-md" href="/login">Login</a>
            <a className="bg-gray-800 font-inter px-8 py-3 text-white rounded-md" href="/register">Create account</a>
        </div>
    );
}
