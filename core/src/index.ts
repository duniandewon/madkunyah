import { MenusDatasourceImpl } from "./data/menus/datasourceImpl";
import { MenusRepositoryImpl } from "./data/menus/repositoryImpl";
import { OrdersDatasourceImpl } from "./data/orders/datasourceImpl";
import { ORdersRepositoryImpl } from "./data/orders/repositoryImpl";
import { PaymentDataSourceImpl } from "./data/payments/dataSourceImpl";
import { GatewayImpl } from "./data/payments/gatewayImpl";
import { PaymentRepositoryImpl } from "./data/payments/respositoryImpl";
import { db } from "./platform/drizzle/client";
import { coreClient } from "./platform/midtrans/client";
import { MenusInteractors } from "./usecases/menus/interactors";
import { OrdersInteractors } from "./usecases/orders/interactors";
import { PaymentsInteractors } from "./usecases/payments/interactors";

export * from "./shared/types/responses";
export * from './config/envConfig';

export * from "./domain/menus/repository";
export * from "./domain/menus/models";
export * from "./usecases/menus/use-case";
export * from "./usecases/menus/interactors";
const menusDatasource = MenusDatasourceImpl(db);
export const menusRepository = MenusRepositoryImpl(menusDatasource);

export * from "./domain/payments/models";
export * from "./domain/payments/repository";
export * from "./domain/payments/gateway";
export * from "./usecases/payments/use-case";
export * from "./usecases/payments/interactors";
export const paymentGateway = GatewayImpl(coreClient);
export const paymentDataSource = PaymentDataSourceImpl(db);
export const paymentRepository = PaymentRepositoryImpl(paymentDataSource);

export * from "./domain/orders/repository";
export * from "./domain/orders/models";
export * from "./usecases/orders/use-case";
export * from "./usecases/orders/interactors";
export const ordersDataSource = OrdersDatasourceImpl(db);
export const ordersRepository = ORdersRepositoryImpl(ordersDataSource);

export const menusUseCases = MenusInteractors(menusRepository);
export const paymentUseCases = PaymentsInteractors(paymentRepository);
export const orderUseCases = OrdersInteractors(
  ordersRepository,
  paymentRepository,
  paymentGateway,
);
