function Controls() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">3. Get & process data</h2>
      <p className="text-gray-400 text-sm">
        You can use this panel to manage your data.
      </p>
      <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Get fresh data
      </button>
      <button className="ml-2 mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Clear data
      </button>
    </div>
  );
}

export default Controls;
