import React from 'react';
import shortid from 'shortid';
import css from './App.module.css';

import Form from '../Form/Form';
import { ContactsList } from '../ContactsList/ContactsList';
import { Filter } from '../Filter/Filter';
class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = ({ name, number }) => {
    const contact = { id: shortid.generate(), name, number };

    const { contacts } = this.state;

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert(`${name} is already in contacts.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = evt => {
    this.setState({ filter: evt.currentTarget.value });
  };
  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState);
    // console.log(this.state);

    if (this.state !== prevState.contacts) {
      console.log('Оновилися контакти');
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  render() {
    const { contacts } = this.state;
    const normalizeFilter = this.state.filter.toLowerCase();
    const visibleContacts = this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );

    return (
      <div className={css.container}>
        <h1 className={css.phonebookTitle}>
          Phone<span className={css.titlePart}>book</span>
        </h1>
        <Form contacts={contacts} onSubmit={this.addContact}></Form>

        {this.state.contacts.length !== 0 ? (
          <>
            <h2 className={css.contactsTitle}>Contacts</h2>
            <Filter
              filter={this.state.filter}
              onChangefilter={this.changeFilter}
            />
            <ContactsList
              contacts={visibleContacts}
              onDeleteContact={this.deleteContact}
            ></ContactsList>
          </>
        ) : (
          <p className={css.empty__notification}>The contact list is empty</p>
        )}
      </div>
    );
  }
}
export default App;
