import React from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import styles from './newsletter-signup.module.scss';

const NewsletterSignup = () => (
  <div className={styles.formContainer}>
    <p>Get remote jobs delivered to your inbox weekly.</p>
    <MailchimpSubscribe url="https://benjamingrobertson.us15.list-manage.com/subscribe/post?u=aafc0f8e65dbc564446043b15&amp;id=ee47f8c168" />
  </div>
);

export default NewsletterSignup;
