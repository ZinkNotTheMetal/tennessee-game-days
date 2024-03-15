import IAddLibraryItemRequest from "./library-item-add";

interface IEditLibraryItemRequest extends IAddLibraryItemRequest {
  id: number
}
export default IEditLibraryItemRequest