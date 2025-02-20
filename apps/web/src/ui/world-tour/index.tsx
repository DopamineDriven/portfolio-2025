import WorldTour from "./temp";


export function WorldTourLayout() {
  return (
    <section className="sm:container mx-auto px-0 pt-5 md:px-4">
      <h2 className="theme-transition flex items-center text-2xl text-current">
        <a className="appearance-auto" id="world-tour">
          World Tour - Total Visitors
        </a>
      </h2>
      <p className="text-muted-foreground text-sm">Work in Progress</p>
      <WorldTour />
    </section>
  );
}

