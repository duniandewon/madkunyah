CREATE TYPE "public"."fulfillment_status" AS ENUM('new', 'preparing', 'delivering', 'completed', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'expired');--> statement-breakpoint
CREATE TABLE "menus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "menus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"image" varchar(255),
	"isAvailable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menus_to_modifier_groups" (
	"menu_id" integer NOT NULL,
	"modifier_group_id" integer NOT NULL,
	CONSTRAINT "menus_to_modifier_groups_menu_id_modifier_group_id_pk" PRIMARY KEY("menu_id","modifier_group_id")
);
--> statement-breakpoint
CREATE TABLE "modifier_group" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "modifier_group_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"minSelect" integer DEFAULT 0,
	"maxSelect" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "modfier_item" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "modfier_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"modifier_group_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item_modifiers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_item_modifiers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_item_id" integer NOT NULL,
	"modifier_group_name_snapshot" varchar(255) NOT NULL,
	"modifier_item_name_snapshot" varchar(255) NOT NULL,
	"modifier_price" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "modifier_quantity_check" CHECK ("order_item_modifiers"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"menu_id" integer NOT NULL,
	"menu_name_snapshot" varchar(255) NOT NULL,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"item_total" integer NOT NULL,
	CONSTRAINT "quantity_check" CHECK ("order_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(50) NOT NULL,
	"delivery_address" text NOT NULL,
	"order_total" integer NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"fulfillment_status" "fulfillment_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"external_id" varchar(255) NOT NULL,
	"gateway_transaction_id" varchar(255),
	"gateway_name" varchar(50) NOT NULL,
	"amount" integer NOT NULL,
	"payment_channel" varchar(50),
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"expire_time" timestamp,
	"payment_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
ALTER TABLE "menus_to_modifier_groups" ADD CONSTRAINT "menus_to_modifier_groups_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menus_to_modifier_groups" ADD CONSTRAINT "menus_to_modifier_groups_modifier_group_id_modifier_group_id_fk" FOREIGN KEY ("modifier_group_id") REFERENCES "public"."modifier_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modfier_item" ADD CONSTRAINT "modfier_item_modifier_group_id_modifier_group_id_fk" FOREIGN KEY ("modifier_group_id") REFERENCES "public"."modifier_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item_modifiers" ADD CONSTRAINT "fk_order_item" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_idx" ON "menus" USING btree ("category");--> statement-breakpoint
CREATE INDEX "menu_name_idx" ON "menus" USING btree ("name");--> statement-breakpoint
CREATE INDEX "menu_id_idx" ON "menus_to_modifier_groups" USING btree ("menu_id");--> statement-breakpoint
CREATE INDEX "modifier_group_id_idx" ON "menus_to_modifier_groups" USING btree ("modifier_group_id");--> statement-breakpoint
CREATE INDEX "group_name_idx" ON "modifier_group" USING btree ("name");--> statement-breakpoint
CREATE INDEX "item_group_id_idx" ON "modfier_item" USING btree ("modifier_group_id");--> statement-breakpoint
CREATE INDEX "idx_order_item_modifiers_order_item_id" ON "order_item_modifiers" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orders_customer_name" ON "orders" USING btree ("customer_name");--> statement-breakpoint
CREATE INDEX "idx_orders_customer_phone" ON "orders" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "idx_payments_external_id" ON "payments" USING btree ("external_id");