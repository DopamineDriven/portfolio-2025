import WorldTour from "./world-tour";

export function WorldTourLayout() {
  return (
    <section className="mx-auto pt-8 lg:px-4">
      <h2 className="heme-transition container flex items-center text-2xl text-current">
        <a className="appearance-auto" id="world-tour">
          World Tour - Total Visitors
        </a>
      </h2>
      <p className="text-muted-foreground container mb-2 text-sm">
        Work in Progress
      </p>
      <WorldTour />
    </section>
  );
}
