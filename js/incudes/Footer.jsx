import React from 'react';
import FooterMenu from '../helpers/footer-components/FooterMenu';

const Footer = props => (
  <footer id="footer">
    <div className="inner">
      {props.project
        ? <FooterMenu
            project={props.project}
            utils = {props.utils}
            filterBy={props.filterBy}
            tasks={props.tasks}
            lastColumnIndex={props.lastColumnIndex}
          />
        : <p>
            Developed by
            <a href="http://smart-cat-solutions.com" target="_blank"> SMART CAT SOLUTIONS</a>
          </p>}
    </div>
  </footer>
);

export default Footer;
