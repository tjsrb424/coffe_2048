import { CORE_CUSTOMERS } from "./coreCustomers";
import { REGULAR_CUSTOMERS } from "./regularCustomers";

export const INITIAL_CUSTOMERS = [...CORE_CUSTOMERS, ...REGULAR_CUSTOMERS];

/** @deprecated 호환용 별칭 — 새 코드는 `INITIAL_CUSTOMERS`를 쓰면 된다. */
export const SAMPLE_CUSTOMERS = INITIAL_CUSTOMERS;

