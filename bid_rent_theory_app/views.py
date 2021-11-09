from django.shortcuts import render
from django.template import loader

# Create your views here.
from django.http import HttpResponse
import pymongo
import json


connection = pymongo.MongoClient(
    "3.1.184.173",
    username="bda_team",
    password="bdabestteam",
    authSource="admin",
    authMechanism="SCRAM-SHA-256",
)

db = connection["bda_hdb_db"]
collection = db["hdb_resale_price_date_split"]


def index(request):
    year = 2008
    month = 1

    # if request.GET("month", "") and request.GET("year", ""):
    #     year = int(request.GET("year", ""))
    #     month = int(request.GET("month", ""))
    # print(year, month)
    # print(request.GET["month"])

    if "year" in request.GET and "month" in request.GET:
        year = int(request.GET["year"])
        month = int(request.GET["month"])

    hdb_resale = list(
        collection.aggregate(
            [
                {"$match": {"actual_year": year, "actual_month": month}},
                {
                    "$project": {
                        "town": 1,
                        "block": 1,
                        "lease_commence_date": 1,
                        "resale_price": 1,
                        "floor_area_sqm": 1,
                        "_id": 0,
                        "latitude": 1,
                        "longitude": 1,
                        "resale_price": 1,
                        "price_per_sqm": {
                            "$divide": [
                                {"$toDouble": "$resale_price"},
                                {"$toDouble": "$floor_area_sqm"},
                            ]
                        },
                        "actual_year": 1,
                        "actual_month": 1,
                    }
                },
            ]
        )
    )

    hdb_resale_highest_price_sqm = list(
        collection.aggregate(
            [
                {"$match": {"actual_year": year, "actual_month": month}},
                {
                    "$project": {
                        "price_per_sqm": {
                            "$divide": [
                                {"$toDouble": "$resale_price"},
                                {"$toDouble": "$floor_area_sqm"},
                            ]
                        },
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "max": {"$max": "$price_per_sqm"},
                        "min": {"$min": "$price_per_sqm"},
                    }
                },
            ]
        )
    )
    return render(
        request,
        "bid_rent_theory_app/map.html",
        {
            "hdb_data_json": json.dumps(hdb_resale),
            "year_selected": year,
            "month_selected": month,
            "max_price_sqm": hdb_resale_highest_price_sqm[0]["max"],
            "min_price_sqm": hdb_resale_highest_price_sqm[0]["min"],
            "years": [
                2008,
                2009,
                2010,
                2011,
                2012,
                2013,
                2014,
                2015,
                2016,
                2017,
                2018,
                2019,
                2020,
                2021,
            ],
            "months": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
            ],
        },
    )
