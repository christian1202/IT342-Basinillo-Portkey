/* ================================================================== */
/*  PORTKEY — Admin Feature Types (Vertical Slice)                     */
/*  Admin-specific request/response shapes.                            */
/*  Reuses User from auth feature and Shipment from shipments feature. */
/* ================================================================== */

import type { User } from "@/features/auth/types";
import type { Shipment } from "@/features/shipments/types";

// Admin feature re-exports these types for convenience.
// The actual domain models live in their respective feature modules.
export type { User, Shipment };
