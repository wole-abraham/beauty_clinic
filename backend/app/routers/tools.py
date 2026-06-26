from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import Response

router = APIRouter(prefix="/tools", tags=["tools"])

@router.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 20 MB.")
    try:
        from rembg import remove
        result = remove(contents)
        stem = (file.filename or "image").rsplit(".", 1)[0]
        return Response(
            content=result,
            media_type="image/png",
            headers={"Content-Disposition": f'attachment; filename="{stem}_nobg.png"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {e}")
