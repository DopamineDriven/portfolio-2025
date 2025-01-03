export function Footer() {
  return (
    <footer className="theme-transition mt-8 bg-primary p-4 text-primary-foreground dark:bg-background/80 dark:text-foreground">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Andrew Ross. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
