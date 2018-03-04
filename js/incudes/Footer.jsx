import React from 'react';
import FooterMenu from '../helpers/footer-components/FooterMenu';

const Footer = props => (
  <footer id="footer">
    <div className="inner">
      {props.project
        ? <FooterMenu project={props.project} />
        : <p>
            Developed by
            <a href="https://smart-cat-solutions.com/"> SMART CAT SOLUTIONS</a>
            .
          </p>}
    </div>
  </footer>
);

export default Footer;
