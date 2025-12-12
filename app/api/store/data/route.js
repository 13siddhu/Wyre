import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


//get store and store products for a user

export async function GET(request) {
    try {
        //get the username  from the query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username').toLowerCase();

        if(!username){
            return NextResponse.json({ error: "Missing username" }, { status: 400 });
        }

        //get store info and stock products with ratings
        const store = await prisma.store.findUnique({
            where: { username, isActive: true},
            include: { Product: { include : {rating : true}}}
        });

        if(!store){
            return NextResponse.json({ error: "Store not found" }, { status: 400 });
        }

        return NextResponse.json({ store });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}