import { menusUseCases, orderUseCases, paymentUseCases } from "@madkunyah/core";

import { PaymentsController } from "@/api/payments/payments.controller";
import { OrdersController } from "@/api/orders/orders.controller";
import { MenusController } from "@/api/menu/menus.controller";
import { MindtransController } from "@/webhook/midtrans/midtrans.controller";

export const paymentsController = new PaymentsController(paymentUseCases);

export const ordersController = new OrdersController(orderUseCases);
export const menusController = new MenusController(menusUseCases);

export const midtransController = new MindtransController(paymentUseCases);