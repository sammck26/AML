const mongoose = require('mongoose');
const faker = require('@faker-js/faker');
const path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, ".env") });

// Load your models
const Customer = require('./customer'); // Adjust the path to your models
const Subscription = require('./subscription');

const generateDummyData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Generate dummy customers
        const customers = [];
        for (let i = 0; i < 10; i++) { // Adjust the number of customers as needed
            const customer = new Customer({
                first_name: faker.faker.name.firstName(),
                last_name: faker.faker.name.lastName(),
                date_of_birth: faker.faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
                phone_no: faker.faker.phone.number(),
                active: faker.faker.datatype.boolean(),
                email: faker.faker.internet.email(),
                password: faker.faker.internet.password(),
                branch_id: new mongoose.Types.ObjectId(), // Replace with actual branch IDs if available
                role_id: new mongoose.Types.ObjectId(), // Replace with actual role IDs if available
                borrowed: [],
                wishlist: Array.from({ length: 3 }, () => faker.faker.datatype.uuid()), // Random wishlist IDs
            });
            customers.push(customer);
        }
        const savedCustomers = await Customer.insertMany(customers);
        console.log("Dummy customers added");

        // Generate dummy subscriptions for each customer
        const subscriptions = [];
        savedCustomers.forEach((customer) => {
            const subscription = new Subscription({
                user_id: customer._id,
                full_name: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                address: faker.faker.address.streetAddress(),
                county: faker.faker.address.county(),
                postcode: faker.faker.address.zipCode(),
                card_number: faker.faker.finance.creditCardNumber(),
                exp_month: faker.faker.date.future().getMonth() + 1,
                exp_year: faker.faker.date.future().getFullYear(),
                cvv: faker.faker.finance.creditCardCVV(),
                start_date: faker.faker.date.past(),
                end_date: faker.faker.date.future(),
            });
            subscriptions.push(subscription);
        });
        await Subscription.insertMany(subscriptions);
        console.log("Dummy subscriptions added");

        // Close the connection
        mongoose.connection.close();
        console.log("Dummy data generation completed");
    } catch (err) {
        console.error("Error generating dummy data:", err);
        mongoose.connection.close();
    }
};

generateDummyData();