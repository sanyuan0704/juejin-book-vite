const modules = import.meta.globEager("./components/*");

console.log(modules);

function App() {
  return (
    <>
      {Object.values(modules).map(({ default: Comp }) => (
        <Comp />
      ))}
    </>
  );
}

export default App;
