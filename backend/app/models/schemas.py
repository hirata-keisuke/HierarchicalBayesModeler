from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

class ModelCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ModelResponse(BaseModel):
    model_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    session_id: str

class NodeCreate(BaseModel):
    node_type: str  # data, observed, latent, hyperparameter, operation, constant
    gui_name: str
    code_name: str
    shape: Optional[str] = None
    distribution: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    operation: Optional[str] = None
    position: Dict[str, float]  # {x: float, y: float}
    constant_value: Optional[Union[float, List[float]]] = None
    csv_mapping: Optional[Dict[str, str]] = None

class NodeUpdate(BaseModel):
    gui_name: Optional[str] = None
    code_name: Optional[str] = None
    shape: Optional[str] = None
    distribution: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    operation: Optional[str] = None
    position: Optional[Dict[str, float]] = None
    constant_value: Optional[Union[float, List[float]]] = None
    csv_mapping: Optional[Dict[str, str]] = None

class NodeResponse(BaseModel):
    node_id: str
    node_type: str
    gui_name: str
    code_name: str
    shape: Optional[str] = None
    distribution: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    operation: Optional[str] = None
    position: Dict[str, float]
    constant_value: Optional[Union[float, List[float]]] = None
    csv_mapping: Optional[Dict[str, str]] = None

class EdgeCreate(BaseModel):
    source: str  # source node_id
    target: str  # target node_id
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None

class EdgeResponse(BaseModel):
    edge_id: str
    source: str
    target: str
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None

class HandleDefinition(BaseModel):
    id: str
    label: str
    type: str = "target"  # target or source

class ParameterDefinition(BaseModel):
    name: str
    display_name: str
    type: str
    handle_id: str
    default: Optional[Any] = None
    description: Optional[str] = None
    required: bool = True

class DistributionDefinition(BaseModel):
    name: str
    display_name: str
    parameters: List[ParameterDefinition]
    pymc_class: str
    support: str
    multivariate: bool = False
    description: Optional[str] = None

class OperationDefinition(BaseModel):
    name: str
    display_name: str
    notation: str
    pymc_function: str
    operands: int
    operand_names: List[str]
    handles: List[HandleDefinition]
    broadcasting: bool = True
    description: Optional[str] = None
