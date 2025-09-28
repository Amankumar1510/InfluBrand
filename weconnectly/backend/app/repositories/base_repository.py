"""
Base repository class with common CRUD operations
"""

from typing import Generic, TypeVar, Type, Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base repository with common CRUD operations"""
    
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session
    
    async def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get a record by ID"""
        result = await self.session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None
    ) -> List[ModelType]:
        """Get multiple records with pagination and filtering"""
        query = select(self.model)
        
        # Apply filters
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    if isinstance(value, list):
                        query = query.where(getattr(self.model, field).in_(value))
                    else:
                        query = query.where(getattr(self.model, field) == value)
        
        # Apply ordering
        if order_by:
            if order_by.startswith('-'):
                # Descending order
                field = order_by[1:]
                if hasattr(self.model, field):
                    query = query.order_by(getattr(self.model, field).desc())
            else:
                # Ascending order
                if hasattr(self.model, order_by):
                    query = query.order_by(getattr(self.model, order_by))
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filtering"""
        query = select(func.count(self.model.id))
        
        # Apply filters
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    if isinstance(value, list):
                        query = query.where(getattr(self.model, field).in_(value))
                    else:
                        query = query.where(getattr(self.model, field) == value)
        
        result = await self.session.execute(query)
        return result.scalar()
    
    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record"""
        if isinstance(obj_in, dict):
            db_obj = self.model(**obj_in)
        else:
            obj_data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in.dict()
            db_obj = self.model(**obj_data)
        
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj
    
    async def update(self, id: int, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        """Update a record by ID"""
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return None
        
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True) if hasattr(obj_in, 'model_dump') else obj_in.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj
    
    async def delete(self, id: int) -> bool:
        """Delete a record by ID"""
        result = await self.session.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.session.commit()
        return result.rowcount > 0
    
    async def exists(self, id: int) -> bool:
        """Check if a record exists by ID"""
        result = await self.session.execute(
            select(self.model.id).where(self.model.id == id)
        )
        return result.scalar_one_or_none() is not None
    
    async def get_with_relations(self, id: int, relations: List[str]) -> Optional[ModelType]:
        """Get a record with specified relationships loaded"""
        query = select(self.model).where(self.model.id == id)
        
        for relation in relations:
            if hasattr(self.model, relation):
                query = query.options(selectinload(getattr(self.model, relation)))
        
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def bulk_create(self, objs_in: List[CreateSchemaType]) -> List[ModelType]:
        """Create multiple records in bulk"""
        db_objs = []
        
        for obj_in in objs_in:
            if isinstance(obj_in, dict):
                db_obj = self.model(**obj_in)
            else:
                obj_data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in.dict()
                db_obj = self.model(**obj_data)
            db_objs.append(db_obj)
        
        self.session.add_all(db_objs)
        await self.session.commit()
        
        # Refresh all objects
        for db_obj in db_objs:
            await self.session.refresh(db_obj)
        
        return db_objs
    
    async def bulk_update(self, updates: List[Dict[str, Any]]) -> int:
        """Update multiple records in bulk"""
        if not updates:
            return 0
        
        # Each update dict should contain 'id' and the fields to update
        updated_count = 0
        
        for update_data in updates:
            if 'id' not in update_data:
                continue
                
            record_id = update_data.pop('id')
            result = await self.session.execute(
                update(self.model)
                .where(self.model.id == record_id)
                .values(**update_data)
            )
            updated_count += result.rowcount
        
        await self.session.commit()
        return updated_count
