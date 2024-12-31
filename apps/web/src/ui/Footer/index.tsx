export default function Footer() {
  return (
    <footer className="transition-bg transition-color mt-8 bg-primary p-4 text-foreground">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Andrew Ross. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
