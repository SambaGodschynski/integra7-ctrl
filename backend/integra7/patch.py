class Patch:
    id: int
    name: str
    msb: int
    lsb: int
    pc: int
    category: str
    type: str
    def __str__(self) -> str:
        return self.name
    def to_dict(self) -> dict:
        return self.__dict__
