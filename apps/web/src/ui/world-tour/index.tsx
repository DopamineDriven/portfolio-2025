import WorldTour from "./temp-two";

export function WorldTourLayout() {
  return (
    <section className="mx-auto pt-8 lg:px-4">
      <h2 className="container heme-transition flex items-center text-2xl text-current">
        <a className="appearance-auto" id="world-tour">
          World Tour - Total Visitors
        </a>
      </h2>
      <p className="container text-muted-foreground text-sm mb-2">Work in Progress</p>
      <WorldTour />
    </section>
  );
}
