import "./globals.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/css/checkout.css";
import "./assets/css/font-awesome.min.css";
import Header from "./components/Server/Header";
import Navbar from "./Components/Server/Navbar";
import Footer from "./Components/Server/Footer";
import { fetchCategories } from "@/app/Services/Category"; 
import ReduxProvider from "../redux/Provider"; // Import Redux Provider

export default async function Layout({ children }) {
  const { data: categories, error } = await fetchCategories();

  if (error) {
    return <div>Erreur : {error}</div>; 
  }

  return (
    <html lang="fr">
      <body>
        <ReduxProvider>
          <Header />
          <Navbar categories={categories} /> 
          <main>{children}</main>
          <Footer categories={categories} /> 
        </ReduxProvider>
      </body>
    </html>
  );
}
