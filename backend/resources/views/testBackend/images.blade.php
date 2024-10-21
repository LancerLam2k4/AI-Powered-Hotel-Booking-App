<form action="{{ route('admin.uploadImages') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div>
        <label for="main_image">Main Image:</label>
        <input type="file" name="main_image" required>
    </div>
    <div>
        <label for="additional_images">Additional Images:</label>
        <input type="file" name="additional_images[]" multiple>
    </div>
    <button type="submit">Upload</button>
</form>
