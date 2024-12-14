const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { getaccountDashboard, updateSubscription } = require('../../src/controllers/accountant.js');
const Subscription = require('../../db/models/subscription.js');
const {Customer} = require('../../db/models/customer.js');

describe('Accountant Controller', function() {
    let req, res, subscriptionFindStub, subscriptionFindByIdAndUpdateStub, customerFindByIdAndUpdateStub;

    beforeEach(() => {
        // Create dummy request and response objects
        req = {
            user: {
                _id: new mongoose.Types.ObjectId().toString(),
                first_name: 'John',
                last_name: 'Doe',
            },
            query: {}
        };

        res = {
            render: sinon.stub(),
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
            redirect: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getaccountDashboard', () => {
        beforeEach(() => {
            // actual data
            const givenSubscription = {
                _id: new mongoose.Types.ObjectId("6749d910fd93e1cd9780edbf"),
                user_id: {
                    _id: new mongoose.Types.ObjectId("6746f827c252ba3cb36816bc"),
                    first_name: 'Jon',
                    last_name: 'Doo',
                    active: true,
                    branch_id: {
                        _id: new mongoose.Types.ObjectId("67471013bb26e601ef6ebf6b"),
                        city: 'Cambridge',
                        branch_description: 'awsome fun happy branch',
                    }
                },
                full_name: "Jon Doo",
                email: "JohnDoe@gmail.com",
                address: "14 Main street",
                county: "Cambridheshire",
                postcode: "CB22 4NQ",
                card_number: "4111 2222 3333 2222",
                exp_month: 12,
                exp_year: 2026,
                cvv: "123",
                start_date: new Date("2024-11-29T00:00:00.000Z"),
                end_date: new Date("2024-12-09T17:06:39.206Z"),
                __v: 0,
                toObject: function() {
                    return { ...this };
                }
            };

            // Stub Subscription.find().populate().exec() to return the given subscription
            subscriptionFindStub = sinon.stub(Subscription, 'find').returns({
                populate: sinon.stub().returnsThis(),
                exec: sinon.stub().resolves([givenSubscription])
            });
        });

        it('should render the accountant_dashboard with the given subscription data', async () => {
            await getaccountDashboard(req, res);

            // find is calleded
            expect(subscriptionFindStub.calledOnce).to.be.true;

            // render is defineatly called
            expect(res.render.calledOnce).to.be.true;
            const [viewName, viewData] = res.render.getCall(0).args;
            expect(viewName).to.equal('accountant/accountant_dashboard');

            // data gies to view
            expect(viewData).to.have.property('subscriptions').that.is.an('array').with.length(1);
            const sub = viewData.subscriptions[0];

            // Check that the subscription data is correct
            expect(sub.full_name).to.equal("Jon Doo");
            expect(sub.email).to.equal("JohnDoe@gmail.com");
            expect(sub.address).to.equal("14 Main street");
            expect(sub.county).to.equal("Cambridheshire");
            expect(sub.postcode).to.equal("CB22 4NQ");
            expect(sub.card_number).to.equal("4111 2222 3333 2222");
            expect(sub.exp_month).to.equal(12);
            expect(sub.exp_year).to.equal(2026);
            expect(sub.cvv).to.equal("123");

            
            expect(viewData).to.have.property('totalPayments').that.is.a('number');
            expect(viewData).to.have.property('totalPaidSoFar').that.is.a('number');
            expect(viewData).to.have.property('totaloutstandingBalances').that.is.a('number');
            expect(viewData).to.have.property('paymentMethods').that.is.an('array');

            
            expect(viewData.activePage).to.equal('dashboard');
        });

        it('should handle errors gracefully', async () => {
            subscriptionFindStub.restore();
            sinon.stub(Subscription, 'find').throws(new Error('Test Error'));

            await getaccountDashboard(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
        });
    });

    describe('updateSubscription', () => {
        let fakeSubscriptionId;
        let fakeSubscription;

        beforeEach(() => {
            
            fakeSubscriptionId = "6749d910fd93e1cd9780edbf"; 
            fakeSubscription = {
                _id: new mongoose.Types.ObjectId(fakeSubscriptionId),
                user_id: new mongoose.Types.ObjectId("6746f827c252ba3cb36816bc"),
                active: true,
                end_date: new Date("2024-12-09T17:06:39.206Z")
            };

            subscriptionFindByIdAndUpdateStub = sinon.stub(Subscription, 'findByIdAndUpdate');
            customerFindByIdAndUpdateStub = sinon.stub(Customer, 'findByIdAndUpdate');

            req.params = { id: fakeSubscriptionId };
            req.body = { active: 'false' }; 
        });

        it('should update subscription and redirect on success', async () => {
            subscriptionFindByIdAndUpdateStub.resolves({
                ...fakeSubscription,
                active: false,
                end_date: new Date() // After update
            });

            customerFindByIdAndUpdateStub.resolves({
                _id: fakeSubscription.user_id,
                active: false
            });

            await updateSubscription(req, res);

            expect(subscriptionFindByIdAndUpdateStub.calledOnce).to.be.true;
            expect(customerFindByIdAndUpdateStub.calledOnce).to.be.true;
            expect(res.redirect.calledOnce).to.be.true;

            const redirectUrl = res.redirect.getCall(0).args[0];
            expect(redirectUrl).to.include('status=success');
        });

        it('should return 404 if subscription not found', async () => {
            subscriptionFindByIdAndUpdateStub.resolves(null); // Simulate not found

            await updateSubscription(req, res);

            expect(res.redirect.calledOnce).to.be.true;
            const redirectUrl = res.redirect.getCall(0).args[0];
            expect(redirectUrl).to.include('status=failure');
        });

        it('should handle errors and redirect with failure message', async () => {
            subscriptionFindByIdAndUpdateStub.throws(new Error('Test Error'));

            await updateSubscription(req, res);

            expect(res.redirect.calledOnce).to.be.true;
            const redirectUrl = res.redirect.getCall(0).args[0];
            expect(redirectUrl).to.include('status=failure');
        });
    });
});
