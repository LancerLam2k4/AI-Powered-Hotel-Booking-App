<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Room</title>
    <link rel="icon" href="BE/products/images/logo1.png" type="webp">
</head>
<body>
    <form action="{{ route('admin.adminsearchRoom') }}" method="GET">
        <div class="search">
            <input type="text" name="keyword" placeholder="Search...">
            <button type="submit" class="search"><i class='bx bx-search' ></i></button>
        </div>
        <a href="{{route('admin.adminAddRoom')}}" class="add-link">Add Products</a>
    </form>
    <thead>
        <tr>
            <th>Room Name</th>
            <th>Room Type</th>
            <th>Room Price</th>
            <th>Room Image</th>
            <th>Edit Room</th>
        </tr>
    </thead>
    <tbody>
    @if (isset($room) && is_object($room))
        @foreach ($room as $rooms)
            <tr>
                <td>
                    {{$rooms->name}}
                </td>
                <td>
                    {{$rooms->type}}
                </td>
                <td>
                    {{number_format($rooms->price)}}VNĐ
                </td>
                <td>
                    <td class="image" style="text-align: center">
                        <div class="image-wrapper">
                            <img src="BE/products/images/{{ $rooms->image }}">
                        </div>
                    </td>
                </td>
                <td class="text-center">
                    <a href="{{route('admin.adminEditRoom',['id'=>$rooms->id]) }}" class="edit-link">Edit</a>
                    <a href="{{route('admin.adminDeleteRoom',['id'=>$rooms->id]) }}" class="delete-link">Delete</a>
                </td>
            </tr>   
        @endforeach
        @php
            $imageData = json_decode(File::get(public_path('images_data.json')), true);
        @endphp
                @foreach($imageData as $data)
                    <img src="{{ asset('images/' . $data['main_image']) }}" alt="Main Image">
                    @foreach($data['additional_images'] as $subImage)
                        <img src="{{ asset('images/' . $subImage) }}" alt="Sub Image">
                    @endforeach
                @endforeach
                
    @endif
</tbody>
    

</body>
</html>