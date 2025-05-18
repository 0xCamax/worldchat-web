
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Mynter
        </h1>
        <button
          className="bg-gray-800 text-white px-8 py-3 rounded-full
                     hover:bg-gray-700 transition-all duration-300
                     shadow-lg hover:shadow-xl text-lg sm:text-xl font-semibold
                     border border-gray-700" // Añadido borde para mayor claridad
          type="button"
        >
          <a href="/worldchat">
            World Chat
          </a>
        </button>
      </div>
    </div>
  );
}
