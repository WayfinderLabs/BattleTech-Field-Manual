const TopBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-[480px] mx-auto px-4 h-12 flex items-center">
        <h1 className="text-primary text-sm font-mono font-bold tracking-[0.2em] uppercase">
          Field Manual
        </h1>
      </div>
    </header>
  );
};

export default TopBar;
