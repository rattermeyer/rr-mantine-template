import { beforeEach, describe, expect, test, vi } from "vitest";
import { updateCustomer } from "./customer.model";
import {logger} from '~/shared/services/logging.server';

describe("CustomerModel", () => {
	test("updateCustomer", () => {
		const customer = updateCustomer.parse({
			customerId: 1,
			firstName: "John",
			lastName: "Doe",
			email: "r.a@test.de",
		});
		logger.debug(customer);
	});
});
