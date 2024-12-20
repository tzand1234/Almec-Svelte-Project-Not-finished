// formValidationRules.js

import { Validators } from '../formTemp/Validators';

export const PHONE_REGEX = /^\d{10}$/;
export const POSTCODE_REGEX = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
export const HUISNUMMER_REGEX = /^[1-9]\d*(?: ?(?:[a-z]|[/-] ?\d+[a-z]?))?$/;
export const USERNAME_REGEX = /^[0-9a-zA-Z]+$/;
export const EMAIL_REGEX = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
export const VAST_NUMMER_REGEX = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
export const MOBIEL_NUMMER_REGEX = /^(((\+31|0|0031)(6|5)){1}[1-9]{1}[0-9]{7})$/i;
export const PLAATS_REGEX = /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/; // Adjust as needed
export const STRAAT_REGEX = /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/; // Adjust as needed
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const formRegister = {
  contactpersoon: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(USERNAME_REGEX, "Contactpersoon kan alleen letters bevatten")] },
  bedrijfsnaam: { validators: [Validators.required, Validators.minLength(3)] },
  wachtwoord: { validators: [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_REGEX, "Zorg ervoor dat uw wachtwoord minstens één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevat.")] },
  email: { list: true, validators: [Validators.required, Validators.pattern(EMAIL_REGEX, "Ongeldig email")] },
  telefoonnummer: { validators: [Validators.required, Validators.minLength(10), Validators.pattern(MOBIEL_NUMMER_REGEX, "Ongeldig telefoonnummer")] },
  postcode: { validators: [Validators.required, Validators.minLength(6), Validators.pattern(POSTCODE_REGEX, "Ongeldig postcode")] },
  huisnummer: { validators: [Validators.required, Validators.pattern(HUISNUMMER_REGEX, "Ongeldig huisnummer")] },
  huisnummerToevoeging: { validators: [Validators.minLength(0)] },
  plaats: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(PLAATS_REGEX, "Invalid place name format")] },
  straat: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(STRAAT_REGEX, "Invalid street name format")] },
};

export const formLogin = {
  bedrijfsnaam: { validators: [Validators.required, Validators.minLength(3)] },
  wachtwoord: { validators: [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_REGEX, "Zorg ervoor dat uw wachtwoord minstens één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevat.")] },
};

export const formAdd = {
  contactpersoon: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(USERNAME_REGEX, "Contactpersoon kan alleen letters bevatten")] },
  bedrijfsnaam: { validators: [Validators.required, Validators.minLength(3)] },
  email: { list: true, validators: [Validators.required, Validators.pattern(EMAIL_REGEX, "Ongeldig email")] },
  telefoonnummer: { validators: [Validators.required, Validators.minLength(10), Validators.pattern(MOBIEL_NUMMER_REGEX, "Ongeldig telefoonnummer")] },
  postcode: { validators: [Validators.required, Validators.minLength(6), Validators.pattern(POSTCODE_REGEX, "Ongeldig postcode")] },
  huisnummer: { validators: [Validators.required, Validators.pattern(HUISNUMMER_REGEX, "Ongeldig huisnummer")] },
  huisnummerToevoeging: { validators: [Validators.minLength(0)] },
  plaats: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(PLAATS_REGEX, "Geen plaats gevonden probeer een ander postcode/huisnummer")] },
  straat: { validators: [Validators.required, Validators.minLength(3), Validators.pattern(STRAAT_REGEX, "Geen straat gevonden probeer een ander postcode/huisnummer")] },
  dozen: { list: true, validators: [Validators.required, Validators.minLength(0)] },
  referentie: {validators: [Validators.required, Validators.minLength(0)]}
};