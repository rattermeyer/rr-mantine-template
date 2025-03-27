import { beforeEach, describe, expect, test, vi } from "vitest";
import { updateCustomer } from "./customer.model";

describe("CustomerModel", () => {
	test("updateCustomer", () => {
		const customer = updateCustomer.parse({
			customerId: 1,
			firstName: "John",
			lastName: "Doe",
			email: "r.a@test.de",
		});
		console.log(customer);
	});
});
