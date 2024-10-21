<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Room</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h2>Create a New Room</h2>
        <form action="{{route('admin.adminUpdateRoom',['id'=>$room->id])}}" method="POST" enctype="multipart/form-data">
            @csrf
            <label for="roomName">Room Name:</label>
            <input type="text" id="roomName" name="name" placeholder="Enter room name" required value="{{$room->name}}">

            <label for="roomType">Room Type:</label>
            <select id="roomType" name="type" required value="{{$room->type}}">
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
            </select>

            <label for="price">Price per Night:</label>
            <input type="number" id="price" name="price" placeholder="Enter price" required value="{{number_format($room->price)}}VNĐ">

            <label for="roomImage">Room Image:</label>
            <input type="file" id="roomImage" name="image" accept="image/*" required>

            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="4" placeholder="Enter room description"></textarea>

            <button type="submit">Update Room</button>
        </form>
    </div>
</body>
</html>
<style>
    {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
    }

    .container {
        width: 50%;
        margin: 50px auto;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

    h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 5px;
        font-weight: bold;
    }

    input, select, textarea, button {
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    button {
        background-color: #28a745;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #218838;
    }

</style>