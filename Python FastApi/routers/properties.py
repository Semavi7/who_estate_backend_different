from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from dependencies import get_db, get_current_user, require_role, Role, public
from models.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyQueryParams,
    Location, GeoPoint
)

router = APIRouter()

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    images: List[UploadFile] = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Parse location JSON
    try:
        location_data = json.loads(property_data.location)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid location JSON"
        )
    
    # Parse selected features JSON if provided
    selected_features = {}
    if property_data.selected_features:
        try:
            selected_features = json.loads(property_data.selected_features)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid selected features JSON"
            )
    
    # Upload images (placeholder implementation)
    image_urls = []
    for image in images:
        # File upload logic here (to be implemented with file upload service)
        image_url = f"https://example.com/images/properties/{image.filename}"
        image_urls.append(image_url)
    
    # Create location object
    geo_point = GeoPoint(
        type="Point",
        coordinates=location_data["geo"]["coordinates"]
    )
    
    location = Location(
        city=location_data["city"],
        district=location_data["district"],
        neighborhood=location_data["neighborhood"],
        geo=geo_point
    )
    
    # Create property document
    property_doc = {
        **property_data.dict(exclude={"location", "selected_features"}),
        "images": image_urls,
        "location": location.dict(),
        "selected_features": selected_features,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.properties.insert_one(property_doc)
    property_doc["_id"] = result.inserted_id
    
    return PropertyResponse(**property_doc)

@router.get("/", response_model=List[PropertyResponse])
@public()
async def get_all_properties(db: AsyncIOMotorDatabase = Depends(get_db)):
    properties = await db.properties.find().to_list(None)
    
    # Add user information to each property
    properties_with_users = []
    for prop in properties:
        if prop.get("user_id"):
            user = await db.users.find_one({"_id": ObjectId(prop["user_id"])})
            prop["user"] = user
        properties_with_users.append(PropertyResponse(**prop))
    
    return properties_with_users

@router.get("/count")
@public()
async def get_properties_count(db: AsyncIOMotorDatabase = Depends(get_db)):
    count = await db.properties.count_documents({})
    return {"total": count}

@router.get("/yearlistings")
@public()
async def get_current_year_listing_stats(db: AsyncIOMotorDatabase = Depends(get_db)):
    current_year = datetime.now().year
    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": datetime(current_year, 1, 1),
                    "$lte": datetime(current_year, 12, 31, 23, 59, 59)
                }
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m", "date": "$created_at"}},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]
    
    result = await db.properties.aggregate(pipeline).to_list(None)
    
    # Fill in missing months with zero counts
    months = []
    for month in range(1, 13):
        month_str = f"{current_year}-{month:02d}"
        month_data = next((item for item in result if item["_id"] == month_str), None)
        months.append({
            "month": month_str,
            "count": month_data["count"] if month_data else 0
        })
    
    return months

@router.get("/query")
@public()
async def query_properties(
    query_params: PropertyQueryParams = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Build query filter
    filter_query = {}
    
    # Location filters
    if query_params.city:
        filter_query["location.city"] = query_params.city
    if query_params.district:
        filter_query["location.district"] = query_params.district
    if query_params.neighborhood:
        filter_query["location.neighborhood"] = query_params.neighborhood
    
    # Property type filters
    if query_params.property_type:
        filter_query["property_type"] = query_params.property_type
    if query_params.listing_type:
        filter_query["listing_type"] = query_params.listing_type
    if query_params.sub_type:
        filter_query["sub_type"] = query_params.sub_type
    
    # Numeric filters
    if query_params.min_price is not None:
        filter_query["price"] = {"$gte": query_params.min_price}
    if query_params.max_price is not None:
        filter_query.setdefault("price", {})["$lte"] = query_params.max_price
    
    if query_params.min_net is not None:
        filter_query["net"] = {"$gte": query_params.min_net}
    if query_params.max_net is not None:
        filter_query.setdefault("net", {})["$lte"] = query_params.max_net
    
    # Other filters
    if query_params.building_age is not None:
        filter_query["building_age"] = query_params.building_age
    if query_params.floor is not None:
        filter_query["floor"] = query_params.floor
    if query_params.number_of_floors is not None:
        filter_query["number_of_floors"] = query_params.number_of_floors
    if query_params.number_of_bathrooms is not None:
        filter_query["number_of_bathrooms"] = query_params.number_of_bathrooms
    if query_params.balcony is not None:
        filter_query["balcony"] = query_params.balcony
    if query_params.dues is not None:
        filter_query["dues"] = query_params.dues
    
    properties = await db.properties.find(filter_query).to_list(None)
    return [PropertyResponse(**prop) for prop in properties]

# Continue with the rest of the endpoints in the next part...
@router.get("/categories")
@public()
async def get_category_structure():
    # This should return the category structure from config
    # For now, return a placeholder structure
    return {
        "property_types": ["Konut", "İş Yeri", "Arsa"],
        "listing_types": ["Satılık", "Kiralık"],
        "sub_types": {
            "Konut": ["Daire", "Villa", "Müstakil Ev"],
            "İş Yeri": ["Dükkan", "Ofis", "Depo"],
            "Arsa": ["Tapulu", "Hisseli"]
        }
    }

@router.get("/near")
@public()
async def find_nearby_properties(
    lon: float = Query(...),
    lat: float = Query(...),
    distance: float = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    properties = await db.properties.find({
        "location.geo": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "$maxDistance": distance
            }
        }
    }).to_list(None)
    
    return [PropertyResponse(**prop) for prop in properties]

@router.get("/address")
@public()
async def get_cities():
    # This should return cities from turkey-neighbourhoods package
    # For now, return some sample cities
    return [
        {"code": "34", "name": "İstanbul"},
        {"code": "06", "name": "Ankara"},
        {"code": "35", "name": "İzmir"}
    ]

@router.get("/lastsix")
@public()
async def get_last_six_properties(db: AsyncIOMotorDatabase = Depends(get_db)):
    properties = await db.properties.find().sort("created_at", -1).limit(6).to_list(None)
    
    # Add user information
    properties_with_users = []
    for prop in properties:
        if prop.get("user_id"):
            user = await db.users.find_one({"_id": ObjectId(prop["user_id"])})
            prop["user"] = user
        properties_with_users.append(PropertyResponse(**prop))
    
    return properties_with_users

@router.get("/piechart")
@public()
async def get_subtype_and_type_percentages(db: AsyncIOMotorDatabase = Depends(get_db)):
    total = await db.properties.count_documents({})
    
    if total == 0:
        return {"message": "Database boş."}
    
    # Count properties by subtype and type
    daire_count = await db.properties.count_documents({"sub_type": {"$regex": "^Daire$", "$options": "i"}})
    villa_count = await db.properties.count_documents({"sub_type": {"$regex": "^Villa$", "$options": "i"}})
    dukkan_count = await db.properties.count_documents({"sub_type": {"$regex": "^Dükkan$", "$options": "i"}})
    arsa_count = await db.properties.count_documents({"property_type": {"$regex": "^Arsa$", "$options": "i"}})
    
    return [
        {
            "name": "Daire",
            "value": (daire_count / total) * 100,
            "color": "#0088FE"
        },
        {
            "name": "Villa",
            "value": (villa_count / total) * 100,
            "color": "#00C49F"
        },
        {
            "name": "Dükkan",
            "value": (dukkan_count / total) * 100,
            "color": "#FFBB28"
        },
        {
            "name": "Arsa",
            "value": (arsa_count / total) * 100,
            "color": "#FF8042"
        }
    ]

@router.get("/address/{city_code}")
@public()
async def get_districts_and_neighbourhoods(city_code: str):
    # This should return districts and neighborhoods from turkey-neighbourhoods package
    # For now, return sample data
    if city_code == "34":  # Istanbul
        return {
            "districts": [
                {
                    "name": "Kadıköy",
                    "neighborhoods": ["Moda", "Feneryolu", "Göztepe"]
                },
                {
                    "name": "Beşiktaş",
                    "neighborhoods": ["Ortaköy", "Bebek", "Etiler"]
                }
            ]
        }
    return {"districts": []}

@router.get("/{id}", response_model=PropertyResponse)
@public()
async def get_property(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    property = await db.properties.find_one({"_id": ObjectId(id)})
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Add user information
    if property.get("user_id"):
        user = await db.users.find_one({"_id": ObjectId(property["user_id"])})
        property["user"] = user
    
    return PropertyResponse(**property)

@router.put("/{id}", response_model=PropertyResponse)
async def update_property(
    id: str,
    property_data: PropertyUpdate,
    new_images: List[UploadFile] = File(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    property = await db.properties.find_one({"_id": ObjectId(id)})
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Handle image updates
    kept_image_urls = []
    if property_data.existing_image_urls:
        try:
            kept_image_urls = json.loads(property_data.existing_image_urls)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid existing image URLs JSON"
            )
    
    # Upload new images
    new_image_urls = []
    if new_images:
        for image in new_images:
            # File upload logic here
            image_url = f"https://example.com/images/properties/{image.filename}"
            new_image_urls.append(image_url)
    
    # Combine images
    final_image_urls = kept_image_urls + new_image_urls
    
    # Prepare update data
    update_data = {}
    for field, value in property_data.dict(exclude_unset=True, exclude={"existing_image_urls"}).items():
        if value is not None:
            if field in ["location", "selected_features"]:
                try:
                    update_data[field] = json.loads(value)
                except json.JSONDecodeError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid {field} JSON"
                    )
            else:
                update_data[field] = value
    
    # Add images and update timestamp
    update_data["images"] = final_image_urls
    update_data["updated_at"] = datetime.utcnow()
    
    # Update property
    await db.properties.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    
    # Return updated property
    updated_property = await db.properties.find_one({"_id": ObjectId(id)})
    return PropertyResponse(**updated_property)

@router.delete("/{id}")
async def delete_property(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    result = await db.properties.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return {"message": "Property deleted successfully"}

@router.patch("/{id}")
async def update_property_user_id(
    id: str,
    user_id: str = Query(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(require_role(Role.Admin))
):
    property = await db.properties.find_one({"_id": ObjectId(id)})
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    await db.properties.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"user_id": user_id, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "User ID updated successfully"}