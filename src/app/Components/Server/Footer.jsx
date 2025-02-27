import Newsletter from "./Newsletter";
import MyStore from "./MyStore";
import Link from "next/link";

const Footer = ({ categories = [] }) => {
  return (
    <div className="footer-top-area">
      <div className="zigzag-bottom"></div>
      <div className="container">
        <div className="row">
          <MyStore />

          <div className="col-md-4 col-sm-6">
            <div className="footer-menu">
              <h2 className="footer-wid-title">Categories</h2>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.id}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default Footer;