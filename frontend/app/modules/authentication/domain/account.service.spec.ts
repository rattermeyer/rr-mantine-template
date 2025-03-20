import type { Transaction } from "kysely";
import type { DB } from "kysely-codegen";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { anyString, mock } from "vitest-mock-extended";
import type { AccountRepository } from "~/modules/authentication/domain/account.repository";
import type { Account } from "~/shared/domain/account.model";
import { AccountService } from "./account.service";

describe("AccountService", () => {
	const mockDb = {
		transaction: vi.fn().mockImplementation(() => ({
			execute: (fn: (tx: Transaction<DB>) => Promise<Account | undefined>) =>
				fn(mockDb),
		})),
	} as unknown as Transaction<DB>;
	const mockAccountRepository = mock<AccountRepository>();
	const accountRepositoryFactory = vi
		.fn()
		.mockReturnValue(mockAccountRepository);
	const accountService = new AccountService(accountRepositoryFactory, mockDb);
	const createAccount: Account = {
		uuid: "123",
		name: "Test User",
		emailVerified: false,
		email: "test@example.com",
		passwordHash: "password",
		roles: [],
		preferences: [],
	};

	beforeEach(async () => {
        mockAccountRepository.createAccount.mock;
        mockAccountRepository.findAccountByEmail.mockReset();
	});

	test("getOrCreateAccount returns existing account", async () => {
		// search for account by email and return the account
		mockAccountRepository.findAccountByEmail
			.calledWith(createAccount.email)
			.mockResolvedValue(createAccount);
		// then it should be returned
		const account = await accountService.getOrCreateAccount(createAccount);
		expect(account).toBe(createAccount);
		expect(mockDb.transaction).toHaveBeenCalled();
		expect(mockAccountRepository.findAccountByEmail).toHaveBeenCalledWith(
			createAccount.email,
		);
	});

	test("getOrCreateAccount create non-existing account", async () => {
		// search for account by email and return the account
		mockAccountRepository.findAccountByEmail
			.calledWith(createAccount.email)
			.mockResolvedValue(undefined);
		mockAccountRepository.createAccount
			.calledWith(createAccount)
			.mockResolvedValue(createAccount);
		// then it should be returned
		const account = await accountService.getOrCreateAccount(createAccount);
		expect(account).toBe(createAccount);
		expect(mockDb.transaction).toHaveBeenCalled();
		expect(mockAccountRepository.createAccount).toHaveBeenCalledWith(
			createAccount,
		);
	});
});
