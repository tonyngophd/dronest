from .db import db

class Location(db.Model):
    __tablename__ = 'locations'


    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    zipCode = db.Column(db.String(10), nullable=True)
    country = db.Column(db.String(50), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)    
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now()) #func.sysdate())
    updatedAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), server_onupdate=db.func.now())


    # to_dict method to convert a dataframe into a dictionary of series or list like data type depending on orient parameter
    def to_dict(self):
        return {
            "id": self.id,
            "city": self.city,
            "state": self.state,
            "zipCode": self.zipCode,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }