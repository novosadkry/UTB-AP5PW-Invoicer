# Online fakturační aplikace – Funkční požadavky a návrh databáze

## Funkční požadavky

### 1. Uživatelská registrace a autentizace
- Uživatel může vytvořit nový účet pomocí e-mailu a hesla.
- Uživatel se může přihlásit do aplikace.
- Možnost obnovy zapomenutého hesla.
- Role uživatelů (např. administrátor, běžný uživatel).

### 2. Správa profilů uživatelů a firem
- Uživatel může upravovat svůj profil (jméno, e-mail, heslo).
- Možnost založit a spravovat údaje o své firmě/podnikání (název, IČ, DIČ, adresa, kontakty).
- Podpora více firem pod jedním uživatelským účtem.

### 3. Správa zákazníků / odběratelů
- Uživatel může přidávat, upravovat a mazat zákazníky/odběratele (jméno firmy/osoby, IČ, DIČ, adresa, kontakty).
- Možnost vyhledávání a filtrování zákazníků.

### 4. Tvorba a správa faktur
- Možnost vytvářet faktury s údaji o zákazníkovi, položkách (služby/produkty), cenách, DPH, datu vystavení a splatnosti.
- Automatické číslování faktur dle nastaveného formátu.
- Editace a mazání faktur.
- Export faktur do PDF (pro tisk a zasílání klientům).
- Odesílání faktur pomocí přímého odkazu.
- Přehled faktur s filtrováním podle stavu (zaplaceno, nezaplaceno, po splatnosti).

### 5. Evidence plateb
- Uživatel může evidovat platby k jednotlivým fakturám.
- Možnost nastavit stav faktury na zaplaceno.
- Přehled uhrazených a neuhrazených faktur.
- Podpora částečných plateb.

### 6. Reporty a statistiky
- Přehled tržeb za různá období.
- Statistiky podle zákazníků, položek, období.
- Export reportů do CSV nebo PDF.

### 7. Nastavení aplikace
- Nastavení formátu číslování faktur.
- Úprava šablony faktur (logo, záhlaví, patička).

---

## Návrh relační databáze

### Tabulka `Users` (Uživatelé)
| Sloupec                 | Typ           | Popis                         |
|-------------------------|---------------|-------------------------------|
| `user_id`               | Primární klíč | ID uživatele                  |
| `email`                 | Unikátní      | E-mail                        |
| `password_hash`         | String        | Hash hesla                    |
| `full_name`             | String        | Celé jméno                    |
| `role`                  | Enum          | (admin, user, ...)            |
| `created_at`            | Timestamp     | Datum vytvoření               |
| `updated_at`            | Timestamp     | Datum poslední úpravy         |
| `password_reset_token`  | String (nullable) | Token pro reset hesla     |
| `password_reset_expiry` | Timestamp     | Expirace tokenu               |

### Tabulka `Companies` (Firmy)
| Sloupec           | Typ           | Popis                          |
|-------------------|---------------|-------------------------------|
| `company_id`      | Primární klíč | ID firmy                      |
| `user_id`         | Cizí klíč     | Odkaz na `Users.user_id`      |
| `name`            | String        | Název firmy                   |
| `ico`             | String        | IČ                            |
| `dic`             | String        | DIČ                           |
| `address`         | String        | Adresa firmy                  |
| `contact_email`   | String        | Kontaktní e-mail              |
| `contact_phone`   | String        | Telefon                       |
| `created_at`      | Timestamp     | Datum vytvoření               |
| `updated_at`      | Timestamp     | Datum poslední úpravy         |

### Tabulka `Customers` (Zákazníci)
| Sloupec           | Typ                  | Popis                           |
|-------------------|----------------------|---------------------------------|
| `customer_id`     | Primární klíč        | ID zákazníka                    |
| `company_id`      | Cizí klíč            | Odkaz na `Companies.company_id` |
| `name`            | String               | Název (firma/osoba)             |
| `ico`             | String (nullable)    | IČ (nepovinné)                  |
| `dic`             | String (nullable)    | DIČ (nepovinné)                 |
| `address`         | String               | Adresa                          |
| `contact_email`   | String               | E-mail                          |
| `contact_phone`   | String               | Telefon                         |
| `created_at`      | Timestamp            | Datum vytvoření                 |
| `updated_at`      | Timestamp            | Datum poslední úpravy           |

### Tabulka `Invoices` (Faktury)
| Sloupec           | Typ           | Popis                                        |
|-------------------|---------------|----------------------------------------------|
| `invoice_id`      | Primární klíč | ID faktury                                   |
| `company_id`      | Cizí klíč     | Odkaz na firmu                               |
| `customer_id`     | Cizí klíč     | Odkaz na zákazníka                           |
| `invoice_number`  | String        | Unikátní v rámci firmy                       |
| `issue_date`      | Date          | Datum vystavení                              |
| `due_date`        | Date          | Datum splatnosti                             |
| `status`          | Enum          | (draft, sent, paid, overdue, partially_paid) |
| `total_amount`    | Decimal       | Celková částka                               |
| `total_vat`       | Decimal       | Celkové DPH                                  |
| `created_at`      | Timestamp     | Datum vytvoření                              |
| `updated_at`      | Timestamp     | Datum poslední úpravy                        |

### Tabulka `InvoiceItems` (Položky faktury)
| Sloupec           | Typ           | Popis                         |
|-------------------|---------------|-------------------------------|
| `invoice_item_id` | Primární klíč | ID položky                    |
| `invoice_id`      | Cizí klíč     | Odkaz na fakturu              |
| `description`     | String        | Popis položky                 |
| `quantity`        | Decimal       | Množství                      |
| `unit_price`      | Decimal       | Jednotková cena               |
| `vat_rate`        | Decimal       | Sazba DPH                     |
| `total_price`     | Decimal       | Cena celkem                   |
| `total_vat`       | Decimal       | DPH celkem                    |
| `created_at`      | Timestamp     | Datum vytvoření               |
| `updated_at`      | Timestamp     | Datum poslední úpravy         |

### Tabulka `Payments` (Platby)
| Sloupec           | Typ           | Popis                         |
|-------------------|---------------|-------------------------------|
| `payment_id`      | Primární klíč | ID platby                     |
| `invoice_id`      | Cizí klíč     | Odkaz na fakturu              |
| `payment_date`    | Date          | Datum platby                  |
| `amount`          | Decimal       | Částka platby                 |
| `payment_method`  | Enum          | Způsob platby (hotově, karta, převod...) |
| `created_at`      | Timestamp     | Datum vytvoření               |

### Tabulka `CompanySettings` (Nastavení firmy)
| Sloupec                  | Typ           | Popis                                    |
|--------------------------|---------------|------------------------------------------|
| `company_id`             | Primární klíč | Odkaz na firmu                           |
| `invoice_number_format`  | String        | Např. `{year}/{company_id}/{sequence}`   |
| `invoice_template`       | JSON / String | Šablona faktury (logo, záhlaví, patička) |
| `created_at`             | Timestamp     | Datum vytvoření                          |
| `updated_at`             | Timestamp     | Datum poslední úpravy                    |

---

## Vztahy mezi tabulkami

- **Users : Companies** = 1 : N (uživatel může mít více firem)  
- **Companies : Customers** = 1 : N (firma má více zákazníků)  
- **Companies : Invoices** = 1 : N (firma vydává více faktur)  
- **Customers : Invoices** = 1 : N (zákazník má více faktur)  
- **Invoices : InvoiceItems** = 1 : N (faktura obsahuje více položek)  
- **Invoices : Payments** = 1 : N (k faktuře může být více plateb)  
- **Companies : CompanySettings** = 1 : 1 (jedno nastavení pro jednu firmu)
